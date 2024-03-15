pub trait Repository<'a, T, E, D> {
    fn new(db: &'a D) -> Self;
    async fn list(&self) -> Result<Vec<T>, E>;
    async fn create(&self, data: &T) -> Result<T, E>;
}
