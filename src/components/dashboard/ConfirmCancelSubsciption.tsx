interface ConfirmCancelSubscriptionProps {
  message: string;
  onDelete: () => void;
  onCancel: () => void;
}

const ConfirmCancelSubscription = ({
  message,
  onDelete,
  onCancel,
}: ConfirmCancelSubscriptionProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Confirmation</h2>
        <p>{message}</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={onDelete}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCancelSubscription;
