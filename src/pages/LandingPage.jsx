import InputForm from '../components/InputForm';

export default function LandingPage({ onSubmit }) {
  return (
    <div className="min-h-screen bg-[#1a1a1a] py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Retirement Calculator
          </h1>
          <p className="text-[#a0a0a0]">
            Plan your financial future with confidence
          </p>
        </div>
        <div className="bg-[#2a2a2a] p-8 rounded-xl border border-[#3a3a3a]">
          <h2 className="text-xl font-semibold text-white mb-6">
            Enter Your Financial Goals
          </h2>
          <InputForm onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
}
