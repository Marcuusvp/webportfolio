import { ReactNode } from 'react'

export function Container({children}: {children: ReactNode}){
    return(
        <div
                className="flex justify-center items-center h-screen"
                style={{
                    backgroundImage: "url('/971.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    overflow: "hidden",
                }}
            >
            {children}
        </div>
    )
}