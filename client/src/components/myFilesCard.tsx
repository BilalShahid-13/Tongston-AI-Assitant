import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, FileText, GraduationCap, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import DescriptionWithDialog from './descriptionWithDialog';

interface LessonPlanData {
  answer: string;
  metaData: string[] | string;
  createdAt?: string;
}

interface LessonPlanCardProps {
  data: LessonPlanData;
  onFavorite?: () => void;
  onView?: () => void;
}

export function MyFilesCard({ data, onView }: LessonPlanCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Extract key information from the markdown content
  const extractInfo = (content: string) => {
    const lines = content.split('\n');
    const info = {
      subject: '',
      yearClass: '',
      age: '',
      location: '',
      topic: '',
      time: '',
      classSize: ''
    };

    lines.forEach(line => {
      if (line.includes('**Subject & Discipline**:')) {
        info.subject = line.split(':')[1]?.trim() || '';
      } else if (line.includes('**Year/Class**:')) {
        info.yearClass = line.split(':')[1]?.trim() || '';
      } else if (line.includes('**Student Average Age**:')) {
        info.age = line.split(':')[1]?.trim() || '';
      } else if (line.includes('**Location**:')) {
        info.location = line.split(':')[1]?.trim() || '';
      } else if (line.includes('**Topic/Sub-topic**:')) {
        info.topic = line.split(':')[1]?.trim() || '';
      } else if (line.includes('**Time Available**:')) {
        info.time = line.split(':')[1]?.trim() || '';
      } else if (line.includes('**Class Size**:')) {
        info.classSize = line.split(':')[1]?.trim() || '';
      }
    });

    return info;
  };

  const lessonInfo = extractInfo(data.answer);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto shadow-md"
    >
      <Card className="overflow-hidden
      bg-gradient-to-br from-white
       via-yellow-50/30 to-amber-50/50
        dark:from-gray-900 dark:via-orange-950/30
         dark:to-amber-950/50 border-0
         shadow-2xl shadow-orange-500/10
         dark:shadow-orange-400/5 hover:shadow-yellow-500/20 transition-all duration-300">
        {/* Header with gradient background */}
        <CardHeader className="rounded-md relative bg-gradient-to-r from-[#ffb900] via-[#fe9a00] to-[#ff8c00] text-white p-6">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
                  >
                    <FileText className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white drop-shadow-sm">
                      {lessonInfo.topic || 'Lesson Plan'}
                    </h2>
                    <p className="text-orange-100 text-sm font-medium">
                      {lessonInfo.subject}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(data?.metaData) ? (
                    data.metaData.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                      >
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                    >
                      {data.metaData}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Date and quick actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-orange-100 text-sm">
                <Calendar className="h-4 w-4" />
                <span>
                  Created: {data.createdAt
                    ? new Date(data.createdAt).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })
                    : 'Today'}
                </span>
              </div>
              {onView && (
                <Button
                  onClick={onView}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Open Full View
                </Button>
              )}
            </div>

            {/* Key info grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20"
              >
                <GraduationCap className="h-4 w-4 text-orange-200" />
                <div className="text-xs">
                  <p className="text-orange-200">Class</p>
                  <p className="font-semibold truncate">{lessonInfo.yearClass}</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20"
              >
                <Clock className="h-4 w-4 text-orange-200" />
                <div className="text-xs">
                  <p className="text-orange-200">Duration</p>
                  <p className="font-semibold">{lessonInfo.time}</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20"
              >
                <Users className="h-4 w-4 text-orange-200" />
                <div className="text-xs">
                  <p className="text-orange-200">Students</p>
                  <p className="font-semibold">{lessonInfo.classSize}</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20"
              >
                <MapPin className="h-4 w-4 text-orange-200" />
                <div className="text-xs">
                  <p className="text-orange-200">Location</p>
                  <p className="font-semibold">{lessonInfo.location}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </CardHeader>

        {/* Content area */}
        <CardContent className="p-0">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DescriptionWithDialog
              des={data.answer}
              fileName={lessonInfo?.topic}
              setIsOpen={setIsDialogOpen}
            />
          </Dialog>
        </CardContent>
      </Card>
    </motion.div>
  );
}