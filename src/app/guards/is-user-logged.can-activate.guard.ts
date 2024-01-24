import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { UserService } from "../users/user.service";

export const isUserLoggedGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isUserLogged())
    return true;

  return router.createUrlTree(['login']);
}