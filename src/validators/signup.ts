import z from "zod";

export const signup=z.object({
    username : z.string().min(4).max(15),
    password : z.string()
})
