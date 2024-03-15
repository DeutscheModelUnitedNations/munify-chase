use async_graphql::{ComplexObject, Context, InputObject, SimpleObject};
use serde::{Deserialize, Serialize};
use surrealdb::{engine::remote::ws::Client, Surreal};

use crate::{
    committees::{repo::CommitteeRepository, Committee},
    error::CustomHandlerError,
    traits::repo::Repository,
};

pub mod query;
mod repo;

#[derive(SimpleObject, InputObject, Default, Debug, Serialize, Deserialize)]
#[graphql(complex, input_name = "ConferenceInput")]
pub struct Conference {
    id: String,
    name: String,
    start: chrono::NaiveDate,
    end: chrono::NaiveDate,
    // we want to write the resolver manually
    #[graphql(skip)]
    committees: Vec<Committee>,
}

#[ComplexObject]
impl Conference {
    async fn committees<'ctx>(
        &self,
        ctx: &Context<'ctx>,
    ) -> Result<Vec<Committee>, CustomHandlerError> {
        let db = ctx.data::<Surreal<Client>>()?;
        let repo = CommitteeRepository::new(db);
        let committees = repo.list_by_conference(&self.id).await?;
        Ok(committees)
    }
}
