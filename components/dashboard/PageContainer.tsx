interface PageContainerProps {
    children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
    return (
        <div className="flex-col mb-5">
            <div className="flex-1 space-y-4 px-4 lg:px-60 pt-6">
                {children}
            </div>
        </div>
    );
};

export default PageContainer;