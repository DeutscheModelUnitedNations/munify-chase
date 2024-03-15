use async_graphql::{Context, Object};
use surrealdb::{engine::remote::ws::Client, Surreal};

use crate::{conferences::Conference, error::CustomHandlerError, traits::repo::Repository};

use super::repo::ConferenceRepository;

#[derive(Default)]
pub struct ConferenceQuery;

#[Object]
impl ConferenceQuery {
    async fn conferences<'ctx>(
        &self,
        ctx: &Context<'ctx>,
    ) -> Result<Vec<Conference>, CustomHandlerError> {
        let db = ctx.data::<Surreal<Client>>()?;
        let repo = ConferenceRepository::new(db);
        Ok(repo.list().await?)
    }
}
