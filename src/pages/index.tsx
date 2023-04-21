import { Inter } from "next/font/google";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Kitten } from "../type";

const inter = Inter({ subsets: ["latin"] });

import axios from "axios";
import { useEffect, useRef, useState } from "react";

const Home: React.FC<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ kittens: initKittens }) => {
    const [kittens, setKittens] = useState<Kitten[]>(initKittens);

    const inputRef = useRef<HTMLInputElement>(null);

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const { data } = await axios.post<{ kitten: Kitten }>(
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
            { name: inputRef.current?.value }
        );

        if (data.kitten) setKittens((old) => [...old, data.kitten]);
    };

    const onDeleteClick = async (_id: string) => {
        const { status } = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/delete` ||
                "http://localhost:3001/delete",
            { _id: _id }
        );
        if (status == 200) {
            setKittens((old) => old.filter((e) => _id !== e._id));
        }
    };

    return (
        <main className="flex items-center justify-center flex-col w-full min-h-screen">
            <form
                action=""
                onSubmit={onSubmit}
                className="flex  max-w-3xl  gap-x-2"
            >
                <input className="text-black px-2" ref={inputRef} />
                <button
                    type="submit"
                    className="px-4 py-2 rounded-md border-2 border-white hover:bg-white hover:text-black"
                >
                    add
                </button>
            </form>
            <div className="flex items-start flex-col  ">
                {kittens.map((e) => (
                    <div
                        key={e._id}
                        className="flex items-center w-full justify-between gap-x-10"
                    >
                        <div className="">{e.name}</div>
                        <div
                            onClick={() => onDeleteClick(e._id)}
                            className="bg-red-500 text-white rounded-md"
                        >
                            delete
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export const getServerSideProps: GetServerSideProps<{
    kittens: Kitten[];
}> = async () => {
    const { data } = await axios.get<{ kittens: Kitten[] }>(
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
    );

    return {
        props: {
            kittens: data.kittens,
        },
    };
};

export default Home;
