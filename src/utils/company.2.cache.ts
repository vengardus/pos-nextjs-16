// utils/company.cache.ts
'use server'

import { companyGetByUser } from '@/actions/companies/querys/company.get-by-user.action'
import { unstable_cache, cacheTag } from 'next/cache'

export async function company2GetByUserCached(
  userId: string,
  role: string
) {
  /**
   * Creamos/consultamos la caché.
   *  - keyParts = ['company-by-user', userId, role]  ← identifica al usuario + rol
   *  - headers: []  ← ignora la cookie de Next-Auth para que no invalide el hit
   */
  return unstable_cache(
    // ---- función que accede a la BD ----
    async () => {
      // 1️⃣ Asociamos el resultado a una etiqueta que SÍ lleva el userId
      cacheTag(`company-by-user:${userId}`)

      // 2️⃣ Hacemos la consulta real
      return await companyGetByUser(userId, role)
    },
    // ---- partes de la clave -----------   (¡pueden ser dinámicas!)
    ['company-by-user', userId, role],

    // ---- opciones ---------------------
    {
      revalidate: 60     // caché “eterna” (cámbialo si quieres TTL)
    }
  )()
}
