import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { SignUpForm } from './components/SignUpForm';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, login, logout, signup } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      {!user ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          {showSignUp ? (
            <SignUpForm 
              onSignUp={signup}
              onSwitchToLogin={() => setShowSignUp(false)}
            />
          ) : (
            <LoginForm 
              onLogin={login}
              onSwitchToSignUp={() => setShowSignUp(true)}
            />
          )}
        </div>
      ) : (
        <Dashboard user={user} onLogout={logout} />
      )}
    </div>
  );
}

export default App;