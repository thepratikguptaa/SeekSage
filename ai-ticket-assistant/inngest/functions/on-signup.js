import { inngest } from "../client.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";

export const onUserSignup = inngest.createFunction(
    {id: "on-user-signup", retries: 3},
    {event: "user/signup"},
    async ({event, step}) => {
        try {
            const {email} = event.data
            const user = await step.run("get-user-email", async() => {
                const userObject = await User.findOne({email})
                if (!userObject) {
                    throw new NonRetriableError("User not found");
                }
                return userObject
            })

            await step.run("send-welcome-email", async() => {
                const subject = `Welcome to SeekSage`
                const message = `Hello, welcome to SeekSage! We're excited to have you here. If you have any questions or need help, please don't hesitate to reach out to our support team. Have a great day! 👋🏻`
                await sendMail(user.email, subject, message)
            })

            return {success: true}

        } catch (error) {
            console.error("❌ Error in Signup Function:", error.message);
            return {success: false};
            
        }
    }
)