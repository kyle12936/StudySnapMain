"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "./components/ui/card"
import { Navigate, NavLink } from "react-router-dom";
import { useState } from "react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { apiBaseUrl } from "./api"

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(1, {
        message: "Confirm Password must not be empty.",
    }),
    email: z.string().email({
        message: "Must be a valid email address.",
    }).min(0, {
        message: "Email must not be empty.",
    })
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"], // path of error
    });


function Register() {

    const [error, setError] = useState('');
    const [register, setRegister] = useState(false);
    const [login, setLogin] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
            defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (error === 'username'){
            form.setError('username', {
                type: 'manual',
                message: 'Username already exists! Enter a different one.',
            }, {shouldFocus: true});
            return;
        }
        if (error === 'email'){
            form.setError('email', {
                type: 'manual',
                message: 'Email already exists! Enter a different one.',
            }, {shouldFocus: true});
            return;
        }


        console.log(form.formState.errors);
        const endpoint = '/api/auth/register';
        const baseUrl = apiBaseUrl;
        let url = baseUrl + endpoint;
        console.log(url);

        console.log(values);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
            const data = await response.json();
            console.log(data.message);
            if (!response.ok) {
                if (response.status === 409){ // Username already exists!

                    switch (data.message){
                        case "Username already exists!":
                            form.setError('username', {
                                type: 'manual',
                                message: 'Username already exists! Enter a different one.',
                            }, {shouldFocus: true});
                            setError('username');
                            return;
                        case "Email already exists!":
                            form.setError('email', {
                                type: 'manual',
                                message: 'Email already exists! Enter a different one.',
                            }, {shouldFocus: true});
                            setError('email');
                            return;
                        default:
                            throw new Error("An unknown error occurred.");
                    }

                }
                throw new Error(`Error: ${response.statusText}`);
            }
            setRegister(true);
            return data; // Handle your response data as needed
        } catch (error) {
            console.error('Failed to Register:', error);
        }
    }
        
    
    const onFormError = (e: any) => {
        console.log("Start Form onFormError");
        console.log(e)
        console.log("End Form onFormError");
    }
 
    return (
    <>
        {register &&
        <div className="flex flex-col items-center space-y-5">
            <div className="size-2/5">
                <DotLottieReact
                    src="/ThumbsUp.lottie"
                    speed={.5}
                    loop
                    autoplay
                    />
            </div>
            
            <h1>Your account has been registered!</h1>
            <Button onClick={() => setLogin(true)}> Click here to log in! </Button>
            {login && <Navigate to="/Login"></Navigate>}
            
        </div>
    

        }
        {!register && 

        
        <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-col items-center">
                <DotLottieReact
                            src="/signup.lottie"
                            speed={.5}
                            loop
                            autoplay
                            />
                <h1>  Register your account </h1>
            </div>
            <div className="flex flex-col items-center">
                <Card className="m-10" style={{width: 400}}>
                    <CardContent className="m-5">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit, onFormError)} className="space-y-6">


                                <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username" {...field}  onChange={(e) => {
                                            field.onChange(e);
                                            setError('')}} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />


                                <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input className=" min-w-100" type="email" placeholder="Email" {...field} onChange={(e) => {
                                            field.onChange(e);
                                            setError('')}} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />

                                <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input className=" min-w-100" type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />

                                <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input className=" min-w-100" type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />


                                <Button className="min-w-full" type="submit">Register</Button>
                            </form>
                        </Form>
                        <NavLink to="/Login" className="text-sm font-medium leading-none cursor-pointer select-none"> Already have an account?</NavLink>
                    </CardContent>
                </Card>

            </div>
            


            
        </div>

        }
    </>
    
    
  )
}
export default Register
