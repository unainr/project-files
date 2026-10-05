import { Chat } from "@/components/chat-ui"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const HomePage = () => {
  return (
    <main className="bg-background">
      <Chat />
    </main>
  )
}

export default HomePage