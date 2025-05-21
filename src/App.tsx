import React, { useState } from 'react';
import Header from './components/header/Header';
import { Tabs, ActionIcon } from '@mantine/core';
import { IoMdClose } from 'react-icons/io';

interface Tab {
  value: string;
  label: string;
  content: React.ReactNode;
}

const App: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { value: 'first', label: 'Главная', content: null }
  ]);
  const [activeTab, setActiveTab] = useState<string>('first');

  const addTab = (label: string, ContentComponent: React.ReactNode) => {
    const timestamp = new Date().toLocaleString();
    const newTab: Tab = {
      value: `${label}-${Date.now()}`,
      label: `${label}: ${timestamp}`,
      content: ContentComponent
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTab(newTab.value);
  };

  const removeTab = (value: string) => {
    setTabs((prevTabs) => {
      const newTabs = prevTabs.filter(tab => tab.value !== value);
      if (value === activeTab && newTabs.length > 0) {
        setActiveTab(newTabs[0].value);
      }
      return newTabs;
    });
  };

  return (
    <>
      <Header addTab={addTab} />
      <Tabs defaultValue={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          {tabs.map((tab) => (
            <div key={tab.value} style={{ display: 'flex', alignItems: 'center' }}>
              <Tabs.Tab value={tab.value}>{tab.label}</Tabs.Tab>
              <ActionIcon
                size="xs"
                color="red"
                onClick={(e: any) => {
                  e.stopPropagation();
                  removeTab(tab.value);
                }}
                title="Удалить вкладку"
              >
                <IoMdClose size={12} />
              </ActionIcon>
            </div>
          ))}
        </Tabs.List>
        {tabs.map((tab) => (
          <Tabs.Panel key={tab.value} value={tab.value}>
            {tab.content}
          </Tabs.Panel>
        ))}
      </Tabs>
    </>
  );
};

export default App;
