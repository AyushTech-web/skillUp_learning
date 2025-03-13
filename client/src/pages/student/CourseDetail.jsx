import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const { data, isLoading, isError } =
    useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h>Failed to load course details</h>;

  const { course, purchased } = data;

  const handleContinueCourse = () => {
    if(purchased){
      navigate(`/course/${courseId}/lectures`);
    }
  }

  return (
    <div className="space-y-5">
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {course?.courseTitle}
          </h1>
          <p className="text-base md:text-lg">{course?.subTitle}</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.creator.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated {course?.createdAt.split("T")[0]}</p>
          </div>
          <div className="flex items-center gap-4">
            <p>Students enrolled: {course?.enrolledStudents.length}</p>
            <p>Level: {course?.courseLevel || "Not specified"}</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>{course.lectures.length} lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.lectures.map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span>
                    {purchased ? <PlayCircle size={14} /> : <Lock size={14} />}
                  </span>
                  <p>{lecture.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              {course.courseThumbnail && (
                <div className="w-full aspect-video mb-4">
                  <img 
                    src={course.courseThumbnail} 
                    alt={course.courseTitle}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="w-full aspect-video mb-4">
                {(purchased || course.lectures[0]?.isPreviewFree) ? (
                  <ReactPlayer
                    width="100%"
                    height={"100%"}
                    url={course.lectures[0]?.videoUrl}
                    controls={true}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="mx-auto mb-2" size={24} />
                      <p className="text-sm">Preview not available</p>
                    </div>
                  </div>
                )}
              </div>
              <h1 className="font-semibold">{course.lectures[0]?.lectureTitle}</h1>
              <Separator className="my-2" />
              <div className="space-y-2">
                <h1 className="text-lg md:text-xl font-semibold">Course Price</h1>
                <p className="text-2xl font-bold">₹{course.coursePrice || "Free"}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button onClick={handleContinueCourse} className="w-full">Continue Course</Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
