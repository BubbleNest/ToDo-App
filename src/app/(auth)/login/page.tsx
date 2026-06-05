import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from './_components/LoginForm'

type Props = {
  searchParams: Promise<{ sent?: string; email?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { sent, email } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Entrez votre email pour recevoir un lien de connexion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="flex flex-col gap-2 text-sm">
              <p className="font-medium text-foreground">Lien envoyé !</p>
              <p className="text-muted-foreground">
                Un lien de connexion a été envoyé à{' '}
                <span className="font-medium text-foreground">{email}</span>.
                Vérifiez votre boite mail.
              </p>
            </div>
          ) : (
            <LoginForm />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
