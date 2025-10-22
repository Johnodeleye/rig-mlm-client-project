// app/components/PointsSystem.tsx
'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, Award } from 'lucide-react';

interface PointsData {
  monthlyPV: { personal: number; team: number };
  cumulativePV: { personal: number; team: number };
  monthlyTP: { personal: number; team: number };
  cumulativeTP: { personal: number; team: number };
}

interface PointsSystemProps {
  pointsData: PointsData;
}

const PointsSystem = ({ pointsData }: PointsSystemProps) => {
  const pointsCards = [
    {
      title: 'Monthly PV',
      icon: Calendar,
      color: 'blue',
      personal: pointsData.monthlyPV.personal,
      team: pointsData.monthlyPV.team,
      total: pointsData.monthlyPV.personal + pointsData.monthlyPV.team
    },
    {
      title: 'Cumulative PV',
      icon: TrendingUp,
      color: 'green',
      personal: pointsData.cumulativePV.personal,
      team: pointsData.cumulativePV.team,
      total: pointsData.cumulativePV.personal + pointsData.cumulativePV.team
    },
    {
      title: 'Monthly TP',
      icon: Users,
      color: 'purple',
      personal: pointsData.monthlyTP.personal,
      team: pointsData.monthlyTP.team,
      total: pointsData.monthlyTP.personal + pointsData.monthlyTP.team
    },
    {
      title: 'Cumulative TP',
      icon: Award,
      color: 'orange',
      personal: pointsData.cumulativeTP.personal,
      team: pointsData.cumulativeTP.team,
      total: pointsData.cumulativeTP.personal + pointsData.cumulativeTP.team
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: 'bg-blue-100', icon: 'text-blue-600', text: 'text-blue-700' },
      green: { bg: 'bg-green-100', icon: 'text-green-600', text: 'text-green-700' },
      purple: { bg: 'bg-purple-100', icon: 'text-purple-600', text: 'text-purple-700' },
      orange: { bg: 'bg-orange-100', icon: 'text-orange-600', text: 'text-orange-700' }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
      {pointsCards.map((card, index) => {
        const colorClasses = getColorClasses(card.color);
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {card.total.toLocaleString()}
                </p>
              </div>
              <div className={`w-10 h-10 lg:w-12 lg:h-12 ${colorClasses.bg} rounded-full flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${colorClasses.icon}`} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs lg:text-sm text-gray-600">Personal</span>
                <span className="text-sm lg:text-base font-medium text-gray-900">
                  {card.personal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs lg:text-sm text-gray-600">Team</span>
                <span className="text-sm lg:text-base font-medium text-gray-900">
                  {card.team.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PointsSystem;