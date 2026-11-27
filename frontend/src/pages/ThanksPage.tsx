import {Button} from "@/components/ui/button.tsx"
import {CheckCircle} from "lucide-react"
import {useNavigate} from "react-router-dom"

export default function ThanksPage() {
  const navigate = useNavigate()

  return (
      <div className="flex min-h-[calc(100vh-9rem)] flex-col items-center justify-center bg-[#f6f6f7] px-4 py-10 sm:px-6">
        <div className="max-w-lg rounded-2xl bg-white p-7 text-center shadow-sm ring-1 ring-black/5 sm:p-10">
          <CheckCircle className="mx-auto mb-6 size-16 text-[#047857] sm:size-20"/>
          <h1 className="mb-4 text-2xl font-bold text-[#24212a] sm:text-3xl">
            Ευχαριστούμε για την παραγγελία σας!
          </h1>
          <p className="mb-8 text-gray-600">
            Η παραγγελία σας ολοκληρώθηκε με επιτυχία. Θα λάβετε email επιβεβαίωσης με όλες τις λεπτομέρειες.
          </p>

          <div className="space-y-3">
            <Button
                className="h-11 w-full rounded-full bg-[#064e3b] text-base font-semibold text-white transition hover:bg-[#047857]"
                onClick={() => navigate("/")}
            >
              Επιστροφή στην Αρχική
            </Button>
            <Button
                className="h-11 w-full rounded-full bg-gray-100 text-base font-semibold text-[#24212a] transition hover:bg-gray-200"
                onClick={() => navigate("/products")}
            >
              Συνέχεια στα Προϊόντα
            </Button>
          </div>
        </div>
      </div>
  )
}
