import mongoose from 'mongoose';

const URI = 'mongodb+srv://girauguillermo:giraug@cluster0.bfpv0cy.mongodb.net/electrogirau?retryWrites=true&w=majority';

mongoose
  .connect(URI)
  .then(() => console.log('Database connected'))

  .catch((error) => console.log(error));
