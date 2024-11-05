import { FormEvent, useState } from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios";

import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "../ui/form"


const SignUpForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const signUpForm = useForm({
        resolver: zodResolver(SignUpFormSchema),
        defaultValues: {
            username: username,
            password: password
        },
    });

    const handleSignUp = (data: z.infer<typeof SignUpFormSchema>) => {
        setIsLoading(true);
        axios.post('/api/v1/auth/sign-up', {
            username: data.username,
            password: data.password,
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        setIsLoading(false);
    }


    const handleSignIn = (event: FormEvent) => {
        event.preventDefault();
    }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
            <Tabs defaultValue="signin" className="w-full md:w-1/2 lg:w-1/3">
                <TabsList >
                    <TabsTrigger disabled={isLoading} value="signin">Sign in</TabsTrigger>
                    <TabsTrigger disabled={isLoading} value="signup">Sign up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <form onSubmit={handleSignIn}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Sign in</CardTitle>
                                <CardDescription>
                                    Welcome back! Log in to your account to keep tracking your finances
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                <Label htmlFor="username">Username</Label>
                                <Input autoComplete="username" disabled={isLoading} id="username" placeholder="JohnDoe" value={username} onChange={(e) => setUsername(e.target.value)}/>
                                </div>
                                <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input autoComplete="current-password" disabled={isLoading} id="password" placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-row justify-end">
                                <Button disabled={isLoading}>Log in</Button>
                            </CardFooter>
                        </Card>
                    </form>
                </TabsContent>
                <TabsContent value="signup">
                    <Form {...signUpForm}>
                        <form onSubmit={signUpForm.handleSubmit(handleSignUp)}>
                            <Card>
                            <CardHeader>
                                <CardTitle>Sign up</CardTitle>
                                <CardDescription>
                                Welcome! Sign up for free to start tracking your finances
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <FormField
                                control={signUpForm.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input autoComplete="username" disabled={isLoading} placeholder="JohnDoe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={signUpForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input autoComplete="new-password" disabled={isLoading} type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </CardContent>
                            <CardFooter className="flex flex-row justify-end">
                                <Button disabled={isLoading} type="submit">Sign up</Button>
                            </CardFooter>
                            </Card>
                        </form>
                        </Form>
                </TabsContent>
            </Tabs>
    </div>
  )
}

export default SignUpForm

const SignUpFormSchema = z.object({
    username: z.string().min(4, {
      message: "Username must be at least 4 characters long.",
}),
    password: z.string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character." }),
});
