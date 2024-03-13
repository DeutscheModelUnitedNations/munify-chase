use async_graphql::Object;

use crate::conferences::Conference;

#[derive(Default)]
pub struct ConferenceQuery;

#[Object]
impl ConferenceQuery {
    async fn conferences(&self) -> Vec<Conference> {
        todo!()
    }
}
