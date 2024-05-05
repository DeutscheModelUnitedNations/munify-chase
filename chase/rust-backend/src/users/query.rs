use async_graphql::Object;

use crate::users::User;

#[derive(Default)]
pub struct UserQuery;

#[Object]
impl UserQuery {
    async fn users(&self) -> Vec<User> {
        todo!()
    }
}
