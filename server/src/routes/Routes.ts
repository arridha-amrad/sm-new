import { Router } from 'express';

abstract class Routes {
  abstract router: Router;
  abstract routes(): void;
}

export default Routes;
