// components/PointsSystem.tsx
'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, Plane } from 'lucide-react';

interface PointsData {
  monthlyPV: {
    personal: number;
    team: number;
  };
  cumulativePV: {
    personal: number;
    team: number;
  };
  monthlyTP: {
    personal: number;
    team: number;
  };
  cumulativeTP: {
    personal: number;
    team: number;
  };
}

interface PointsSystemProps {
  pointsData: PointsData;
}

const PointsSystem = ({ pointsData }: PointsSystemProps) => {
  const cards = [
    {
      title: 'Monthly Point Value',
      data: pointsData.monthlyPV,
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Cumulative Points Value',
      data: pointsData.cumulativePV,
      icon: Award,
      color: 'purple'
    },
    {
      title: 'Monthly Travel Points',
      data: pointsData.monthlyTP,
      icon: Plane,
      color: 'green'
    },
    {
      title: 'Cumulative Travel Points',
      data: pointsData.cumulativeTP,
      icon: Users,
      color: 'orange'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                card.color === 'blue' ? 'bg-blue-100' :
                card.color === 'purple' ? 'bg-purple-100' :
                card.color === 'green' ? 'bg-green-100' : 'bg-orange-100'
              }`}>
                <Icon className={`w-5 h-5 ${
                  card.color === 'blue' ? 'text-blue-600' :
                  card.color === 'purple' ? 'text-purple-600' :
                  card.color === 'green' ? 'text-green-600' : 'text-orange-600'
                }`} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{card.data.personal}</p>
                <p className="text-xs text-gray-600">Personal</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{card.data.team}</p>
                <p className="text-xs text-gray-600">Team</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PointsSystem;