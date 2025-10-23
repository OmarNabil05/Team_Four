import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputFile } from "./inputfile";

interface InputsAreaProps {
    title: string;
    data: string[];
}
export default function InputsCard(props: InputsAreaProps) {
    return (
        <div className="w-full h-screen flex items-center justify-center gap-6 p-6">



            <div className="w-full max-w-3xl p-6 bg-gradient-to-br from-background to-muted rounded-2xl shadow-sm transition-all duration-300">
                <h1 className="text-center mb-2 text-2xl">{props.title}</h1>
                <table className="w-full text-right border-separate border-spacing-y-3" dir="rtl">
                    <tbody>
                        {props.data.map(
                            (elem: string, index: number) => {
                                return (
                                    <tr key={index} >
                                        <td className="w-1/3">
                                            <Label className="text-nowrap font-medium">{elem}</Label>
                                        </td>
                                        <td>
                                            {(elem.includes('PDF') ? (
                                                <InputFile />
                                            ) :(elem.includes('تاريخ'))? <Input className="w-full" placeholder={elem} type="date" /> : (
                                                elem.includes('ملاحظات') ? <Input className="w-full h-[100px]" placeholder={elem} /> : <Input className="w-full" placeholder={elem} />
                                            ))}

                                        </td>
                                    </tr>);
                            }
                        )}

                    </tbody>
                </table>
            </div>



        </div >
    )
}
