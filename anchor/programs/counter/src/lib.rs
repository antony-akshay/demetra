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
            owner: ctx.accounts.payer.key(),
        };
        Ok(())
    }

    pub fn addCandidate(ctx: Context<AddCandidate>, name: String) -> Result<()> {
        *ctx.accounts.candidate_account = CandidateAccount {
            name: name,
            total_votes: 0,
        };

        ctx.accounts.election_account.total_candidates += 1;
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>) -> Result<()> {
        let candidate_account = &mut ctx.accounts.candidate_account;
        candidate_account.total_votes += 1;
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
#[instruction(name:String)]
pub struct AddCandidate<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut,
        seeds=[
            election_account.name.as_bytes(),
            election_account.owner.key().as_ref(),
        ],
        bump,
    )]
    pub election_account: Account<'info, ElectionAccount>,

    #[account(
        init,
        payer=payer,
        space=8+CandidateAccount::INIT_SPACE,
        seeds=[
            election_account.key().as_ref(),
            payer.key().as_ref()
        ],
        bump
    )]
    pub candidate_account: Account<'info, CandidateAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut,
        seeds=[
            election_account.name.as_bytes(),
            election_account.owner.key().as_ref(),
        ],
        bump,
    )]
    pub election_account: Account<'info, ElectionAccount>,

    #[account(
        mut,
        seeds=[
            election_account.key().as_ref(),
            &election_account.total_candidates.to_le_bytes()
        ],
        bump
    )]
    pub candidate_account: Account<'info, CandidateAccount>,

    pub system_program: Program<'info, System>,
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
    owner: Pubkey,
}

#[account]
#[derive(InitSpace)]
pub struct CandidateAccount {
    #[max_len(32)]
    name: String,
    total_votes: u8,
}
