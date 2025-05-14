import SwiftUI
import CoreImage
import CoreImage.CIFilterBuiltins
import CoreML
import ExampleModel

struct FocusView: View {
    @State private var focusLevel: Float = 0.5
    private let context = CIContext()
    private var filter = CIFilter.gaussianBlur()

    var body: some View {
        VStack {
            Text("Lente Virtuale")
                .font(.largeTitle)
                .padding()
            
            Text("Regola la messa a fuoco per la tua visione ottimale")
                .padding()
            
            HStack {
                Text("Sfocato")
                Slider(value: $focusLevel, in: 0.6...1)
                    .padding()
                    .onChange(of: focusLevel) { newValue in
                        applyFocusEffect()
                    }
                Text("Nitido")
            }
            .padding()
            
            HStack {
                ForEach(6..<11) { i in
                    Text("\(i)")
                        .font(.caption)
                        .frame(maxWidth: .infinity)
                }
            }
            .padding(.horizontal)
            
            // Testo per simulare la messa a fuoco
            Text("Questo è un testo di esempio per testare la messa a fuoco.")
                .font(.body)
                .padding()
                .blur(radius: CGFloat((1 - focusLevel) * 10)) // Transizione da sfocato a nitido
                .scaleEffect(CGFloat(1 + focusLevel * 0.5)) // Effetto di allontanamento
                .opacity(Double(1 - focusLevel * 0.5)) // Riduzione dell'opacità per simulare la distanza
            
            Spacer()
        }
    }
    
    private func applyFocusEffect() {
        // Logica per applicare il filtro di sfocatura
    }
}

// Carica il modello ExampleModel
let model: ExampleModel = {
    do {
        let config = MLModelConfiguration()
        return try ExampleModel(configuration: config)
    } catch {
        fatalError("Errore nel caricamento del modello: \(error)")
    }
}()

// Esempio di utilizzo del modello ExampleModel
func useModel(focusLevel: Float) {
    do {
        // Prepara l'input per il modello ExampleModel
        let input = ExampleModelInput(input1: focusLevel)

        // Ottieni la previsione
        let prediction = try model.prediction(input: input)

        // Usa il risultato della previsione
        print("Risultato della previsione: \(prediction.output1)")
    } catch {
        print("Errore durante la previsione: \(error)")
    }
}

// Chiama la funzione useModel() quando necessario
// Assicurati di passare il focusLevel corretto dal contesto appropriato
// useModel(focusLevel: focusLevel)

#Preview {
    FocusView()
} 