use surrealdb::{engine::remote::ws::Client, Surreal};

use crate::traits::repo::Repository;

use super::User;

pub struct UserRepository<'a> {
    db: &'a Surreal<Client>,
}

impl<'a> Repository<'a, User, surrealdb::Error, Surreal<Client>> for UserRepository<'a> {
    fn new(db: &'a Surreal<Client>) -> Self {
        Self { db }
    }

    async fn list(&self) -> Result<Vec<User>, surrealdb::Error> {
        self.db.query("SELECT * FROM users").await?.check()?.take(0)
    }
}
