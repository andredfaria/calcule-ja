import React, { useState } from 'react';

interface Person {
  id: number;
  name: string;
  items: { description: string; value: number }[];
}

export const BillSplitter: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: '', items: [] }
  ]);
  const [tip, setTip] = useState('');

  const addPerson = () => {
    setPeople([...people, { id: Date.now(), name: '', items: [] }]);
  };

  const removePerson = (id: number) => {
    setPeople(people.filter(person => person.id !== id));
  };

  const updatePersonName = (id: number, name: string) => {
    setPeople(people.map(person => 
      person.id === id ? { ...person, name } : person
    ));
  };

  const addItem = (personId: number) => {
    setPeople(people.map(person => 
      person.id === personId 
        ? { ...person, items: [...person.items, { description: '', value: 0 }] }
        : person
    ));
  };

  const updateItem = (personId: number, index: number, field: 'description' | 'value', value: string | number) => {
    setPeople(people.map(person => {
      if (person.id === personId) {
        const newItems = [...person.items];
        newItems[index] = { ...newItems[index], [field]: value };
        return { ...person, items: newItems };
      }
      return person;
    }));
  };

  const removeItem = (personId: number, index: number) => {
    setPeople(people.map(person => 
      person.id === personId 
        ? { ...person, items: person.items.filter((_, i) => i !== index) }
        : person
    ));
  };

  const calculateTotal = () => {
    const subtotal = people.reduce((total, person) => 
      total + person.items.reduce((sum, item) => sum + item.value, 0), 0
    );
    const tipAmount = subtotal * (Number(tip) / 100);
    return {
      subtotal,
      tipAmount,
      total: subtotal + tipAmount
    };
  };

  const calculatePersonTotal = (personId: number) => {
    const person = people.find(p => p.id === personId);
    if (!person) return 0;
    const subtotal = person.items.reduce((sum, item) => sum + item.value, 0);
    const tipShare = subtotal * (Number(tip) / 100);
    return subtotal + tipShare;
  };

  const totals = calculateTotal();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Divisão de Contas</h2>
        <button
          onClick={addPerson}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Adicionar Pessoa
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {people.map(person => (
          <div key={person.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="Nome da pessoa"
                value={person.name}
                onChange={(e) => updatePersonName(person.id, e.target.value)}
                className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {people.length > 1 && (
                <button
                  onClick={() => removePerson(person.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remover
                </button>
              )}
            </div>

            <div className="space-y-2">
              {person.items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Descrição"
                    value={item.description}
                    onChange={(e) => updateItem(person.id, index, 'description', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Valor"
                    value={item.value || ''}
                    onChange={(e) => updateItem(person.id, index, 'value', Number(e.target.value))}
                    className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeItem(person.id, index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
              ))}
              <button
                onClick={() => addItem(person.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                + Adicionar Item
              </button>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">
                Total (com gorjeta): R$ {calculatePersonTotal(person.id).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Gorjeta (%)</label>
          <input
            type="number"
            value={tip}
            onChange={(e) => setTip(e.target.value)}
            className="mt-1 block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span>R$ {totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Gorjeta:</span>
            <span>R$ {totals.tipAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>R$ {totals.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};