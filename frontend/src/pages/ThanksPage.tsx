import {Button} from "@/components/ui/button.tsx"
import {CheckCircle} from "lucide-react"
import {useNavigate} from "react-router-dom"

export default function ThanksPage() {
  const navigate = useNavigate()

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
        <div className="bg-white shadow-lg rounded-lg p-10 max-w-lg text-center">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6"/>
          <h1 className="text-3xl font-bold text-green-700 mb-4">
            Ευχαριστούμε για την παραγγελία σας!
          </h1>
          <p className="text-gray-600 mb-8">
            Η παραγγελία σας ολοκληρώθηκε με επιτυχία. Θα λάβετε email επιβεβαίωσης με όλες τις λεπτομέρειες.
          </p>

          <div className="space-y-3">
            <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg"
                onClick={() => navigate("/")}
            >
              Επιστροφή στην Αρχική
            </Button>
            <Button
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-lg"
                onClick={() => navigate("/products")}
            >
              Συνέχεια στα Προϊόντα
            </Button>
          </div>
        </div>
      </div>
  )
}