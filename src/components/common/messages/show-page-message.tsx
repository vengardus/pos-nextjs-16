
interface ShowPageMessageProps {
  modelName?: string;
  customMessage?: string;
  errorMessage?: string;
}

const defaultMessage = "Error al consultar ";
export const ShowPageMessage = ({
  customMessage,
  errorMessage,
  modelName
}: ShowPageMessageProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>
        {customMessage
          ? `${customMessage} ${errorMessage? `(${errorMessage})` : ''}`
          : `${defaultMessage} ${modelName??''}. ${errorMessage??''}`}
      </p>
    </div>
  );
};
