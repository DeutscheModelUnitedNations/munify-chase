use async_graphql::Object;

use crate::committees::Committee;

#[derive(Default)]
pub struct CommitteeQuery;

#[Object]
impl CommitteeQuery {
    pub async fn committees(&self) -> Vec<Committee> {
        todo!()
    }
}
