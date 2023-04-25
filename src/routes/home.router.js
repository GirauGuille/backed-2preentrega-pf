import { Router } from "express";

const router = Router()
router.post('/',(req,res)=>{
    const {username,password} = req.body
    console.log(username, password)
    res.send('Bienvenido')
})
export default router