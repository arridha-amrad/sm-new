import { Router } from 'express';

abstract class IRoutes {
  abstract router: Router;
  abstract routes(): void;
}

export default IRoutes;
