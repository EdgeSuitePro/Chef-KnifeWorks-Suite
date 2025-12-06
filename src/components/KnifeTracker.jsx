import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPackage, FiTool, FiStar, FiCheck } = FiIcons;

const KnifeTracker = ({ currentStage = 1 }) => {
  const stages = [
    {
      id: 1,
      title: 'Received',
      description: 'Your knives have been safely received',
      icon: FiPackage
    },
    {
      id: 2,
      title: 'Sharpening',
      description: 'Expert sharpening in progress',
      icon: FiTool
    },
    {
      id: 3,
      title: 'Finishing Touches',
      description: 'Final inspection and polishing',
      icon: FiStar
    },
    {
      id: 4,
      title: 'Ready for Pickup',
      description: 'Your knives are sharp and ready!',
      icon: FiCheck
    }
  ];

  const getStageStatus = (stageId) => {
    if (stageId < currentStage) return 'completed';
    if (stageId === currentStage) return 'active';
    return 'pending';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.id);
          
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`knife-tracker-stage ${status}`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300">
                  <SafeIcon 
                    icon={status === 'completed' ? FiCheck : stage.icon} 
                    className="w-8 h-8"
                  />
                </div>
                
                <h3 className="font-serif font-semibold text-lg mb-2">
                  {stage.title}
                </h3>
                
                <p className="text-sm opacity-90">
                  {stage.description}
                </p>

                {/* Progress indicator */}
                {index < stages.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-current opacity-30 transform translate-x-3" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar for Mobile */}
      <div className="md:hidden mt-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-steel-gray">Stage {currentStage} of {stages.length}</span>
          <span className="text-sm text-steel-gray">{Math.round((currentStage / stages.length) * 100)}%</span>
        </div>
        <div className="w-full bg-whetstone-cream rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStage / stages.length) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-damascus-bronze h-2 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default KnifeTracker;