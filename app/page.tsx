import { Progress } from "@/components/ui/progress"

export default function Home() {
    return(
        <div className="home">
        <h1 className="text-3xl text-white font-bold text-center">Step 1: Input Your Name</h1>
        <div className="my-3 w-1/2 mx-auto">
        <Progress value={2} />
        </div>
        </div>
    )
}