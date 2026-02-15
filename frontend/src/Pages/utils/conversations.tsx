// Supprime les imports fs et path
// Remplace les fonctions readConversations/saveConversation par :

/**
 * Lit les conversations depuis localStorage
 */
export const readConversations = (): Array<{ pays: string; conv: Array<{ user: string; message: string }>; }> => {
  const data = localStorage.getItem('conversations');

  return data ? JSON.parse(data) : [];
};

export const readConversationByCountry = (pays: string): Array<{ user: string; message: string }> | undefined => {
  const conversations = readConversations(); // Fonction existante (voir code précédent)
  const conversation = conversations.find(conv => conv.pays === pays);
  return conversation?.conv;
};

/**
 * Sauvegarde une conversation dans localStorage
 */
export const saveConversation = (pays: string, messages: Array<{ user: string; message: string }>) => {
  const conversations = readConversations();

  // Cherche si une conversation pour ce pays existe déjà
  const existingIndex = conversations.findIndex(conv => conv.pays === pays);

  if (existingIndex >= 0) {
    // Ajoute les messages à la conversation existante
    conversations[existingIndex].conv.push(...messages);
  } else {
    // Crée une nouvelle entrée
    conversations.push({ pays, conv: messages });
  }

  localStorage.setItem('conversations', JSON.stringify(conversations));
};
