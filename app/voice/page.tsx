import Weather from "@/components/api-weather"
import { Progress } from "@/components/ui/progress"

export default function Voice() {

    return(
        <div className="voice">
        <h1 className="text-3xl text-white font-bold text-center mb-3">Step 2: Select a Voice</h1>
        <div className="my-3 w-1/2 mx-auto">
        <Progress value={34} label="step 2"/>
        </div>
      </div>
    )
}