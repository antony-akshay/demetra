#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("4yGygWL87SGoAREFyAXSetn6LnZnU9nk1gbcJncFfduZ");

#[program]
pub mod counter {
    use super::*;

    pub fn InitializeElection(
        ctx: Context<InitializeElection>,
        name: String,
        start_time: u8,
        end_time: u8,
    ) -> Result<()> {
        *ctx.accounts.election_account = ElectionAccount {
            name: name,
            start_time: start_time,
            end_time: end_time,
            winner: None,
            total_candidates: 0,
            bump: ctx.bumps.election_account,
        };
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name:String)]
pub struct InitializeElection<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer=payer,
        space = 8 + ElectionAccount::INIT_SPACE,
        seeds=[
            name.as_bytes(),
            payer.key().as_ref(),
        ],
        bump,
    )]
    pub election_account: Account<'info, ElectionAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeCounter<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  init,
  space = 8 + Counter::INIT_SPACE,
  payer = payer
    )]
    pub counter: Account<'info, Counter>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseCounter<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  mut,
  close = payer, // close account and return lamports to payer
    )]
    pub counter: Account<'info, Counter>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}

#[account]
#[derive(InitSpace)]
pub struct Counter {
    count: u8,
}

#[account]
#[derive(InitSpace)]
pub struct ElectionAccount {
    #[max_len(32)]
    name: String,
    total_candidates: u8,
    start_time: u8,
    end_time: u8,
    winner: Option<Pubkey>,
    bump: u8,
}
