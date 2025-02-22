import NavigationBar from "./NavigationBar";

const LayoutStyle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-bg-blue00 min-h-screen">
      <div className="max-w-screen-sm mx-auto bg-white rounded-[16px] min-h-screen shadow-lg">
        <div className="pb-8">{children}</div>
        <NavigationBar />
      </div>
    </div>
  );
};

export default LayoutStyle;
