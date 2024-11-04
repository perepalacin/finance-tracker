
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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

    const signUpForm = useForm({
        resolver: zodResolver(SignUpFormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const handleSignUp = (data: z.infer<typeof SignUpFormSchema>) => {
        // Handle sign-up logic here
        console.log("Sign Up Data:", data)
    }

  return (
    <div className="h-screen w-100 flex flex-col items-center justify-center">
        <div className="h-100 w-100">
            <Tabs defaultValue="signin">
                <TabsList >
                    <TabsTrigger value="signin">Sign in</TabsTrigger>
                    <TabsTrigger value="signup">Sign up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <form onSubmit={() => {window.alert("Sign in")}}>
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
                                <Input id="username" placeholder="JohnDoe" />
                                </div>
                                <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" placeholder="password" type="password"/>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-row justify-end">
                                <Button>Log in</Button>
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
                                Welcome! Create an account for free to start tracking your finances anonymously!
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <FormField
                                control={signUpForm.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="JohnDoe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={signUpForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </CardContent>
                            <CardFooter className="flex flex-row justify-end">
                                <Button type="submit">Sign up</Button>
                            </CardFooter>
                            </Card>
                        </form>
                        </Form>
                </TabsContent>
            </Tabs>
        </div>
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
