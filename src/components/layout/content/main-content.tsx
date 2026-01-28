import { ReactNode } from "react";

interface MainContentProps {
    children: ReactNode;
    className?: string;
    title?: string;
    description?: string;
    layout?: "centered" | "wide" | "fullscreen";
}

interface SectionProps {
    children: ReactNode;
    title?: string;
    className?: string;
}

export function MainContent({
    children,
    className = "",
    title,
    description,
    layout = "centered",
}: MainContentProps) {
    const baseClasses = "mx-auto p-6 space-y-8";

    const layoutClasses = {
        centered: "max-w-2xl",
        wide: "max-w-4xl",
        fullscreen:
            "w-full min-h-screen flex flex-col items-center justify-center",
    };

    const mainClassName =
        `${baseClasses} ${layoutClasses[layout]} ${className}`.trim();

    return (
        <main className={mainClassName}>
            {(title || description) && (
                <div className="space-y-2">
                    {title && (
                        <h1 className="text-2xl font-semibold">{title}</h1>
                    )}
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            )}
            {children}
        </main>
    );
}

export function Section({ children, title, className = "" }: SectionProps) {
    return (
        <section className={`space-y-3 ${className}`.trim()}>
            {title && <h2 className="text-lg font-medium">{title}</h2>}
            {children}
        </section>
    );
}
