import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import { AppConstants } from "./shared/constants/app.constants";
import { compare } from "bcryptjs";
import { User } from "@/server/modules/user/domain/user.interface";
import { ResponseAction } from "@/shared/types/common/response-action.interface";
import { initResponseAction } from "./utils/response/init-response-action";
import { userGetByColumnUseCase } from "./server/modules/user/use-cases/user.get-by-column.use-case";
import { userInsertSuperadminAction } from "./server/modules/user/next/actions/user.insert-superadmin.action";

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: {},
      password: { label: "Password", type: "password" },
    },
    authorize: async (c) => {
      console.log("credentials", c);
      let user = null;
      try {

        const email = c.email as string;
        const password = c.password as string;

        console.log("email", email);
        console.log("password", password);

        if (!email || !password) {
          console.log("❌ Faltan email o password");
          return null;
        }

        console.log("PASSSSA 1")

        // logic to verify if the user exists
        const resp = await userGetByColumnUseCase("email", email);

        console.log("PASSSSA 2, resp", resp)

        if (!resp.success) {
          console.log("Invalid credentials.");
          return null;
        }

        console.log("PASSSSA 3")

        user = resp.data as User;
        if ( !user) {
          console.log("No user found.")
          return null
        }
        else {
          console.log("PASSSSA 4")

          const isValidPassword = await compare(password, user.password);
          console.log("PASSSSA 5")

          if (!user || !isValidPassword) {
            console.log("Invalid credentials.");
            return null
          }

          console.log("PASSSSA 6")

        }

        console.log("PASSSSA 7", user)

        // return JSON object with the user data
        return user;
      } catch (error) {
        console.log("ERROR:", error);
        // Return `null` to indicate that the credentials are invalid
        return null;
      }
      return user
    },
  }),
  GoogleProvider ({
    authorization: {
      prompt: "", // Fuerza la selección de cuenta
    }
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/signin-error",
  },

  //  By default, the `id` property does not exist on `token` or `session`. See the [TypeScript](https://authjs.dev/getting-started/typescript) on how to add it.
  callbacks: {
    async signIn({ user, account }) {
      console.log('*** signIn callback START ***', account, user);

      if (!user || !account) {
        console.log("Faltan datos de usuario o cuenta");
        return false; // Deniega el acceso si falta información
      }
      
      let respUser: ResponseAction
      respUser = initResponseAction();

      if ( account.provider === "credentials" ) {
        respUser = await userGetByColumnUseCase(
          "email",
          user.email as string
        ); 
      }
      else {
        // provider google or social media
        respUser = await userGetByColumnUseCase(
          "authId",
          account.providerAccountId as string
        );
      }
    

      if (!respUser.success) {
        console.log("Ocurrió un error en la consulta", respUser.message);
        return false;
      }

      if (!respUser.data) {
        console.log("Usuario no registrado, se creará un nuevo registro");

        const respInsert = await userInsertSuperadminAction({
          authId: account.providerAccountId as string,
          roleId: UserRole.ADMIN as string,
          email: user.email as string,
          currencySymbol: AppConstants.DEFAULT_VALUES.currencySymbol,
          companyName: AppConstants.DEFAULT_VALUES.companyName,
          documentTypeName: AppConstants.DEFAULT_VALUES.documentTypeName,
          categoryName: AppConstants.DEFAULT_VALUES.categoryName,
          categoryColor: AppConstants.DEFAULT_VALUES.categoryColor,
          password: "",
          authType: account.provider as string,
          imageUrl: user.image as string,
          userName: user.name as string,
          brandName: AppConstants.DEFAULT_VALUES.brandName,
          clientName: AppConstants.DEFAULT_VALUES.clientName,
          personType: AppConstants.DEFAULT_VALUES.personTypes[0]
            .value as string,
        });
        if (!respInsert.success) {
          console.log(
            "Ocurrio un error al insertar el nuevo usuario",
            respInsert.message
          );
          return false;
        }
        user.id = respInsert.data;
        console.log("El usuario se insertó exitosamente", respInsert.data);
      } else {
        console.log("El usuario ya estaba registrado");
        user.id = respUser.data.id;
      }
      // console.log('*** signIn callback END ***');
      return true;
    },
    async jwt({ token, user }) {
      // console.log("🔹 jwt callback | Antes:", token);

      if (user) {
        const resp = await userGetByColumnUseCase(
          "id",
          user.id as string
        );
        if (resp.success && resp.data) {
          token.id = resp.data.id;
          token.role = resp.data.roleId;
        }
      }

      // console.log("🔹 jwt callback | Después:", token);

      return token;
    },
    async session({ session, token }) {
      // console.log("🔸 session callback | Antes:", session);

      session.user.id = token.id as string;
      session.user.role = token.role as string;

      // console.log("🔸 session callback | Después:", session);

      return session;
    },
  },
});
