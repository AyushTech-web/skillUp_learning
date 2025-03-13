import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const TestCardInfo = () => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Test Card Details</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Card Number:</span> 4242 4242 4242 4242</p>
          <p><span className="font-medium">Expiry:</span> Any future date (e.g., 12/25)</p>
          <p><span className="font-medium">CVC:</span> Any 3 digits (e.g., 123)</p>
          <p><span className="font-medium">Name:</span> Any name</p>
        </div>
      </div>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Other Test Cards</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Success:</span> 4242 4242 4242 4242</p>
          <p><span className="font-medium">Declined:</span> 4000 0000 0000 0002</p>
          <p><span className="font-medium">Authentication Required:</span> 4000 0025 0000 3155</p>
        </div>
      </div>
    </div>
  );
};

const BuyCourseButton = ({ courseId }) => {
  const navigate = useNavigate();
  const [createCheckoutSession, { data, isLoading, isSuccess, isError, error }] =
    useCreateCheckoutSessionMutation();
  const [showTestInfo, setShowTestInfo] = useState(false);
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);

  const purchaseCourseHandler = async () => {
    try {
      const result = await createCheckoutSession(courseId).unwrap();
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create checkout session");
    }
  };

  // Check if we're returning from a successful payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    if (success === 'true' && !hasHandledSuccess) {
      setHasHandledSuccess(true);
      toast.success('Payment successful!');
      // Navigate to the course detail page to show the updated state
      navigate(`/course-detail/${courseId}`);
    }
  }, [navigate, courseId, hasHandledSuccess]);

  return (
    <div className="space-y-2">
      <Button
        disabled={isLoading}
        onClick={purchaseCourseHandler}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          "Purchase Course"
        )}
      </Button>
      
      {/* Test Card Info Modal */}
      <Dialog open={showTestInfo} onOpenChange={setShowTestInfo}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full text-sm">
            <CreditCard className="mr-2 h-4 w-4" />
            View Test Card Details
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Card Information</DialogTitle>
          </DialogHeader>
          <TestCardInfo />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuyCourseButton;
