use async_graphql::{ComplexObject, Context, InputObject, SimpleObject};
use serde::{Deserialize, Serialize};

use crate::{committees::Committee, error::CustomHandlerError};

pub mod query;

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
        Ok(vec![])
    }
}
