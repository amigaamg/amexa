import React, { useState, useEffect, useRef } from 'react';
import { Send, Lock, Shield, Users, Search, MoreVertical, Pin, Image, Paperclip } from 'lucide-react';

// Mock data and services for demonstration
const mockUser = { uid: 'user1', username: 'john_doe', uni: 'UoN', verified: true };
const mockRecipient = { uid: 'user2', username: 'jane_smith', uni: 'KU', verified: true };

// Mock encrypted messages
const mockMessages = [
  {
    id: '1',
    text: 'Hey! Did you see the interesting case posted in pediatrics?',
    senderUid: 'user2',
    createdAt: new Date(Date.now() - 3600000),
    encrypted: true
  },
  {
    id: '2', 
    text: 'Yes! The fever of unknown origin case. Really challenging differential.',
    senderUid: 'user1',
    createdAt: new Date(Date.now() - 3000000),
    encrypted: true
  },
  {
    id: '3',
    text: 'I was thinking kawasaki disease vs juvenile arthritis. What do you think?',
    senderUid: 'user2', 
    createdAt: new Date(Date.now() - 2400000),
    encrypted: true
  }
];

const mockGroups = [
  { id: '1', name: 'Pediatrics Year 3', members: 15, lastMessage: 'Great case discussion today!', unread: 2 },
  { id: '2', name: 'Surgery Rotation', members: 8, lastMessage: 'Anyone joining the OR tomorrow?', unread: 0 },
  { id: '3', name: 'Internal Medicine', members: 12, lastMessage: 'New guidelines posted', unread: 5 }
];

// Chat interface component
const AmexanChat = () => {
  const [selectedChat, setSelectedChat] = useState('dm_user2');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [showKeyVerification, setShowKeyVerification] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock encryption/sending function
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setIsEncrypting(true);
    
    // Simulate encryption delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const message = {
      id: Date.now().toString(),
      text: newMessage,
      senderUid: mockUser.uid,
      createdAt: new Date(),
      encrypted: true
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setIsEncrypting(false);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const ChatMessage = ({ message }) => {
    const isOwn = message.senderUid === mockUser.uid;
    const sender = isOwn ? mockUser : mockRecipient;
    
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-800'
        }`}>
          {!isOwn && (
            <div className="text-xs opacity-75 mb-1">
              {sender.username} · {sender.uni}
              {sender.verified && <Shield className="inline w-3 h-3 ml-1" />}
            </div>
          )}
          <div className="text-sm">{message.text}</div>
          <div className={`text-xs mt-1 flex items-center ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
          }`}>
            <Lock className="w-3 h-3 mr-1" />
            {formatTime(message.createdAt)}
          </div>
        </div>
      </div>
    );
  };

  const ChatHeader = () => (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
          {mockRecipient.username[0].toUpperCase()}
        </div>
        <div className="ml-3">
          <div className="flex items-center">
            <span className="font-semibold">{mockRecipient.username}</span>
            <span className="text-gray-500 ml-1">· {mockRecipient.uni}</span>
            {mockRecipient.verified && <Shield className="w-4 h-4 ml-1 text-blue-500" />}
          </div>
          <div className="flex items-center text-sm text-green-600">
            <Lock className="w-3 h-3 mr-1" />
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </div>
      <button 
        onClick={() => setShowKeyVerification(true)}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );

  const MessageInput = () => (
    <div className="border-t bg-white p-4">
      <div className="flex items-center space-x-2">
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
          <Paperclip className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
          <Image className="w-5 h-5" />
        </button>
        <input
          type="text"
          placeholder="Type a message... (E2EE enabled)"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isEncrypting}
        />
        <button
          onClick={sendMessage}
          disabled={isEncrypting || !newMessage.trim()}
          className={`p-2 rounded-full ${
            isEncrypting || !newMessage.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors`}
        >
          {isEncrypting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      {isEncrypting && (
        <div className="text-xs text-gray-500 mt-2 flex items-center">
          <Lock className="w-3 h-3 mr-1" />
          Encrypting message...
        </div>
      )}
    </div>
  );

  const GroupList = () => (
    <div className="w-1/3 bg-gray-50 border-r">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Chats</h2>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <Users className="w-5 h-5" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* Direct Message */}
      <div
        className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
          selectedChat === 'dm_user2' ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
        }`}
        onClick={() => setSelectedChat('dm_user2')}
      >
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {mockRecipient.username[0].toUpperCase()}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="font-semibold text-sm">{mockRecipient.username}</span>
                <span className="text-gray-500 text-xs ml-1">· {mockRecipient.uni}</span>
                {mockRecipient.verified && <Shield className="w-3 h-3 ml-1 text-blue-500" />}
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(messages[messages.length - 1]?.createdAt)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 truncate">
                <Lock className="w-3 h-3 inline mr-1" />
                {messages[messages.length - 1]?.text.substring(0, 30)}...
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Groups */}
      {mockGroups.map((group) => (
        <div
          key={group.id}
          className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
            selectedChat === `group_${group.id}` ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
          }`}
          onClick={() => setSelectedChat(`group_${group.id}`)}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white">
              <Users className="w-6 h-6" />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{group.name}</span>
                <div className="flex items-center">
                  {group.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 mr-2">
                      {group.unread}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">12:30</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate">
                  {group.lastMessage}
                </span>
                <span className="text-xs text-gray-400">{group.members} members</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const KeyVerificationModal = () => (
    showKeyVerification && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Verify Safety Code</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              Compare this safety code with {mockRecipient.username} to verify your conversation is secure.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-center">
              <div className="text-sm text-gray-700">
                12345 67890<br />
                54321 09876<br />
                11111 22222
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-green-600">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-sm">End-to-end encrypted</span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setShowKeyVerification(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Safety code verified!');
                  setShowKeyVerification(false);
                }}
                className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="h-screen flex bg-gray-100">
      <GroupList />
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat === 'dm_user2' ? (
          <>
            <ChatHeader />
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <MessageInput />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Select a chat to start messaging
              </h3>
              <p className="text-gray-500">
                All direct messages are end-to-end encrypted for your privacy
              </p>
            </div>
          </div>
        )}
      </div>

      <KeyVerificationModal />
    </div>
  );
};

// Forum Post Component for clinical cases
const ClinicalCasePost = () => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const sampleCase = {
    id: '1',
    title: 'Pediatric Case: 3-year-old with Prolonged Fever',
    author: { username: 'med_student_23', uni: 'UoN', verified: true },
    area: 'Pediatrics',
    createdAt: new Date(Date.now() - 86400000),
    summary: 'A 3-year-old presents with 5 days of high fever (39°C), irritability, and refusal to eat. No obvious source identified on initial examination.',
    clinicalDetails: {
      history: 'Previously healthy child, up-to-date immunizations, no recent travel',
      vitals: 'T: 39.2°C, HR: 140 bpm, RR: 28/min, BP: 95/55 mmHg',
      pe: 'Ill-appearing child, conjunctival injection, strawberry tongue, cervical lymphadenopathy',
      labs: 'WBC: 15,000, ESR: 85, CRP: 120, PLT: 450,000'
    },
    question: 'What is the most likely diagnosis and immediate management?',
    reactions: { upvote: 12, helpful: 8 },
    commentCount: 5
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    alert('Comment added! (Demo)');
    setNewComment('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Case Header */}
      <div className="border-b pb-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {sampleCase.area}
          </span>
          <span className="text-gray-500 text-sm">
            Posted {sampleCase.createdAt.toLocaleDateString()}
          </span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {sampleCase.title}
        </h1>
        
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {sampleCase.author.username[0].toUpperCase()}
          </div>
          <div className="ml-3">
            <div className="flex items-center">
              <span className="font-semibold text-sm">{sampleCase.author.username}</span>
              <span className="text-gray-500 text-sm ml-1">· {sampleCase.author.uni}</span>
              {sampleCase.author.verified && <Shield className="w-4 h-4 ml-1 text-blue-500" />}
            </div>
          </div>
        </div>
      </div>

      {/* Case Content */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Clinical Summary</h3>
          <p className="text-gray-700 leading-relaxed">{sampleCase.summary}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">History</h4>
              <p className="text-gray-700 text-sm">{sampleCase.clinicalDetails.history}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Vital Signs</h4>
              <p className="text-gray-700 text-sm font-mono">{sampleCase.clinicalDetails.vitals}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Physical Exam</h4>
              <p className="text-gray-700 text-sm">{sampleCase.clinicalDetails.pe}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Laboratory Results</h4>
              <p className="text-gray-700 text-sm font-mono">{sampleCase.clinicalDetails.labs}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Question for Discussion</h4>
          <p className="text-blue-800">{sampleCase.question}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 pt-4 border-t">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
            <div className="w-6 h-6 border-2 border-current rounded flex items-center justify-center">
              <span className="text-sm">↑</span>
            </div>
            <span className="text-sm">{sampleCase.reactions.upvote}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
          >
            <span className="text-sm">💬 {sampleCase.commentCount} Comments</span>
          </button>
          
          <button className="text-gray-600 hover:text-blue-600 text-sm">
            🔖 Save
          </button>
          
          <button className="text-gray-600 hover:text-red-600 text-sm">
            🚩 Report
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Discussion</h3>
            
            {/* Sample Comment */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  R
                </div>
                <div className="ml-2">
                  <span className="font-semibold text-sm">resident_doe</span>
                  <span className="text-gray-500 text-sm ml-1">· KU</span>
                  <Shield className="w-3 h-3 ml-1 text-blue-500 inline" />
                </div>
                <span className="text-gray-500 text-xs ml-auto">2 hours ago</span>
              </div>
              <p className="text-gray-700 text-sm">
                Based on the constellation of findings - prolonged fever, conjunctival injection, 
                strawberry tongue, and cervical lymphadenopathy - this presentation is highly 
                suggestive of Kawasaki disease. The elevated inflammatory markers support this. 
                Immediate echocardiogram and cardiology consultation would be indicated.
              </p>
            </div>

            {/* Add Comment */}
            <div className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on this case... (Remember: no PHI)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  💡 Tip: Include references to support your differential diagnosis
                </span>
                <button
                  onClick={addComment}
                  disabled={!newComment.trim()}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    newComment.trim()
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
export default function AmexanApp() {
  const [currentView, setCurrentView] = useState('chat');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Global Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AMEXAN
              </div>
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => setCurrentView('forum')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'forum'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Forums
                </button>
                <button
                  onClick={() => setCurrentView('chat')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'chat'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Chats
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search cases, users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {mockUser.username[0].toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentView === 'chat' ? <AmexanChat /> : <ClinicalCasePost />}
      </main>
    </div>
  );
}