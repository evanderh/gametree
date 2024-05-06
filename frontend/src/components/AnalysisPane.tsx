import { useState } from "react";
import EngineHeader from "./Engine/EngineHeader";
import EngineInfo from "./Engine/EngineInfo";
import EngineControls from "./Engine/EngineControls";

type Tab = 'engine' | 'game';
const tabs: Tab[] = ['engine', 'game'];

const AnalysisPane = () => {
  const [activeTab, setActiveTab] = useState<Tab>('engine');

  const renderTabContent = () => {
    switch(activeTab) {
      case 'game':
        return <div></div>
      case 'engine':
        return (
          <>
            <EngineHeader/>
            <EngineInfo />
            <EngineControls />
          </>
        );
      default:
        return <div></div>;
    }
  };

  return (
    <div className="flex flex-col h-full shadow-2xl min-h-64 sm:min-h-0 border border-neutral-400">
      {/* tabs */}
      <div className="bg-neutral-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pt-1 px-4 text-neutral-700 hover:text-black focus:outline-none font-mono border-b-2 ${
              activeTab === tab ? 'border-neutral-900' : 'border-transparent'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* content */}
      <div className="flex-1 flex flex-col min-h-0 border-t border-gray-400 bg-neutral-100">
        { renderTabContent() }
      </div>
    </div>
  )
}

export default AnalysisPane;