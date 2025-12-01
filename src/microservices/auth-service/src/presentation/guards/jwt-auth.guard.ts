import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  // NO SOBRESCRIBIR canActivate si quieres que valide el token y obtenga el usuario.
  // Al dejarlo vacío, usa la lógica de AuthGuard que ejecuta la estrategia y llena req.user
}