use async_graphql::{Context, Object};

use crate::{conferences::Conference, error::CustomHandlerError};

#[derive(Default)]
pub struct ConferenceQuery;

#[Object]
impl ConferenceQuery {
    async fn conferences<'ctx>(
        &self,
        ctx: &Context<'ctx>,
    ) -> Result<Vec<Conference>, CustomHandlerError> {
        Ok(vec![])
    }
}
