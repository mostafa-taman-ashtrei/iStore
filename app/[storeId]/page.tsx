interface StoreDashboardPageProps {
  params: {
    storeId: string;
  };
}

const StoreDashboardPage: React.FC<StoreDashboardPageProps> = ({ params }) => {
  return <h1>Welcome to {params.storeId} dashboard.</h1>;
};

export default StoreDashboardPage;
