import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RepositoryFactory } from '../../../infrastructure';

interface SetBaselineButtonProps {
  routeId: string;
}

function SetBaselineButton({ routeId }: SetBaselineButtonProps) {
  const queryClient = useQueryClient();
  const routeRepo = RepositoryFactory.getRouteRepository();

  const setBaselineMutation = useMutation({
    mutationFn: (routeId: string) => routeRepo.setBaseline(routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['comparison'] });
    },
  });

  return (
    <button
      onClick={() => setBaselineMutation.mutate(routeId)}
      disabled={setBaselineMutation.isPending}
      className="btn btn-primary text-xs"
    >
      {setBaselineMutation.isPending ? 'Setting...' : 'Set Baseline'}
    </button>
  );
}

export default SetBaselineButton;
